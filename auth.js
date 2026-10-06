(() => {
  "use strict";

  const V = Validators;
  const USERS_KEY = "calm_users";
  const REMEMBER_KEY = "calm_remember";
  const ATTEMPTS_KEY = "calm_attempts";
  const MAX_ATTEMPTS = 5;
  const LOCK_SECONDS = 30;

  const $ = (id) => document.getElementById(id);


  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const write = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

  const hashPassword = async (pw, salt) => {
    if (!(window.crypto && crypto.subtle)) return "plain:" + pw;
    const data = new TextEncoder().encode(salt + ":" + pw);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  
  const setError = (input, msg) => {
    const field = input.closest(".field");
    const out = $(input.id + "Error");
    const bad = !!msg;
    field.classList.toggle("invalid", bad);
    field.classList.toggle("valid", !bad && input.type !== "checkbox" && input.value !== "");
    input.setAttribute("aria-invalid", bad ? "true" : "false");
    if (out) out.textContent = msg;
    return !bad; // true when valid
  };

  const showMessage = (text, type) => {
    const box = $("formMessage");
    box.textContent = text;
    box.className = "message show " + type;
  };
  const clearMessage = () => { $("formMessage").className = "message"; };

  const guard = (el, max) => {
    el.maxLength = max;
    el.addEventListener("input", () => {
      if (el.type === "checkbox") return;
      const cleaned = V.clean(el.value);
      if (cleaned !== el.value) el.value = cleaned;
    });
  };

  /* Validate on blur, and re-validate live once the field is showing an error */
  const bindField = (el, check) => {
    el.addEventListener("blur", () => { if (el.value !== "" || el.closest(".field").classList.contains("invalid")) setError(el, check()); });
    el.addEventListener("input", () => {
      clearMessage();
      if (el.closest(".field").classList.contains("invalid")) setError(el, check());
    });
  };


  const EYE = '<svg viewBox="0 0 24 24"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/></svg>';
  document.querySelectorAll(".toggle").forEach((btn) => {
    btn.innerHTML = EYE;
    btn.addEventListener("click", () => {
      const input = $(btn.dataset.target);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show ? EYE_OFF : EYE;
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* Run all checks, focus the first invalid field, return true if all passed */
  const runAll = (checks) => {
    const results = checks.map(([el, fn]) => ({ el, ok: setError(el, fn()) }));
    const firstBad = results.find((r) => !r.ok);
    if (firstBad) firstBad.el.focus();
    return !firstBad;
  };

 
  if (document.body.dataset.page === "login") {
    const form = $("loginForm");
    const idEl = $("identifier");
    const pwEl = $("password");
    const remember = $("remember");
    const btn = form.querySelector(".btn");
    let timer = null;

    guard(idEl, V.LIMITS.email);
    guard(pwEl, V.LIMITS.passwordMax);

    const checkId = () => V.identifier(idEl.value);
    const checkPw = () => V.loginPassword(pwEl.value);
    bindField(idEl, checkId);
    bindField(pwEl, checkPw);

    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) { idEl.value = saved; remember.checked = true; }

    const checkLock = () => {
      const a = read(ATTEMPTS_KEY, { count: 0, until: 0 });
      const left = Math.ceil((a.until - Date.now()) / 1000);
      if (left > 0) {
        btn.disabled = true;
        showMessage(`Too many failed attempts. Try again in ${left}s.`, "fail");
        clearTimeout(timer);
        timer = setTimeout(checkLock, 1000);
        return true;
      }
      if (a.until) { write(ATTEMPTS_KEY, { count: 0, until: 0 }); clearMessage(); }
      btn.disabled = false;
      return false;
    };
    checkLock();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (checkLock()) return;
      clearMessage();
      if (!runAll([[idEl, checkId], [pwEl, checkPw]])) {
        return showMessage("Please fix the highlighted fields.", "fail");
      }

      const id = V.clean(idEl.value).trim().toLowerCase();
      const user = read(USERS_KEY, []).find((u) => u.email === id || u.username === id);
      const ok = user && (user.hash
        ? (await hashPassword(pwEl.value, user.email)) === user.hash
        : user.password === pwEl.value);

      if (!user) return showMessage("No account found with that email or username. Please sign up first.", "fail");

      if (!ok) {
        const a = read(ATTEMPTS_KEY, { count: 0, until: 0 });
        a.count += 1;
        if (a.count >= MAX_ATTEMPTS) { a.count = 0; a.until = Date.now() + LOCK_SECONDS * 1000; }
        write(ATTEMPTS_KEY, a);
        setError(pwEl, "Incorrect password.");
        if (checkLock()) return;
        return showMessage(`Login failed. ${MAX_ATTEMPTS - a.count} attempt(s) left.`, "fail");
      }

      write(ATTEMPTS_KEY, { count: 0, until: 0 });
      remember.checked ? localStorage.setItem(REMEMBER_KEY, idEl.value.trim()) : localStorage.removeItem(REMEMBER_KEY);
      showMessage("Login successful! Welcome back, " + user.name.split(" ")[0] + ".", "success");
      btn.disabled = true;
    });

    $("forgot").addEventListener("click", (e) => {
      e.preventDefault();
      clearMessage();
      const err = checkId();
      setError(idEl, err);
      if (err) { idEl.focus(); return showMessage("Enter your email or username first, then click 'Forget password?'.", "fail"); }
      showMessage("If an account exists for " + idEl.value.trim() + ", a reset link has been sent.", "success");
    });
  }


  if (document.body.dataset.page === "register") {
    const form = $("registerForm");
    const nameEl = $("fullName");
    const emailEl = $("email");
    const pwEl = $("password");
    const cfEl = $("confirmPassword");
    const terms = $("terms");
    const btn = form.querySelector(".btn");

    guard(nameEl, V.LIMITS.name);
    guard(emailEl, V.LIMITS.email);
    guard(pwEl, V.LIMITS.passwordMax);
    guard(cfEl, V.LIMITS.passwordMax);

    const checkName = () => V.fullName(nameEl.value);
    const checkEmail = () => V.email(emailEl.value);
    const checkPw = () => V.password(pwEl.value, { name: nameEl.value, email: emailEl.value });
    const checkCf = () => V.confirmPassword(cfEl.value, pwEl.value);
    const checkTerms = () => V.terms(terms.checked);

    bindField(nameEl, checkName);
    bindField(emailEl, checkEmail);
    bindField(pwEl, checkPw);
    bindField(cfEl, checkCf);
    pwEl.addEventListener("input", () => { if (cfEl.value) setError(cfEl, checkCf()); });
    terms.addEventListener("change", () => setError(terms, checkTerms()));

    $("termsLink").addEventListener("click", (e) => {
      e.preventDefault();
      showMessage("Terms & Conditions: please use this app responsibly.", "success");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearMessage();
      if (!runAll([[nameEl, checkName], [emailEl, checkEmail], [pwEl, checkPw], [cfEl, checkCf], [terms, checkTerms]])) {
        return showMessage("Please fix the highlighted fields and try again.", "fail");
      }

      const mail = V.clean(emailEl.value).trim().toLowerCase();
      const users = read(USERS_KEY, []);
      if (users.some((u) => u.email === mail)) {
        setError(emailEl, "An account with this email already exists.");
        emailEl.focus();
        return showMessage("Registration failed. Try logging in instead.", "fail");
      }

      btn.disabled = true;
      users.push({
        name: V.clean(nameEl.value).trim().replace(/\s+/g, " "),
        email: mail,
        hash: await hashPassword(pwEl.value, mail),
      });
      write(USERS_KEY, users);

      showMessage("Account created successfully! Redirecting to login...", "success");
      setTimeout(() => { window.location.href = "index.php"; }, 1800);
    });
  }
})();