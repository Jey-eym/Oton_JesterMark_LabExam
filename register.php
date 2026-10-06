<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Register</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Almendra:ital,wght@0,400;0,700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="background.css">
</head>
<body data-page="register">
  <main class="page">
    <h1 class="title">Your journey to calm<br>begins here</h1>

    <form id="registerForm" class="form" novalidate>
      <div class="field">
        <div class="input-wrap">
          <input type="text" id="fullName" placeholder="Full Name" autocomplete="name">
          <span class="icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="4.2"/><path d="M3.5 21c0-4.6 3.8-7.5 8.5-7.5s8.5 2.9 8.5 7.5z"/></svg>
          </span>
        </div>
        <small class="error" id="fullNameError"></small>
      </div>

      <div class="field">
        <div class="input-wrap">
          <input type="text" id="email" placeholder="Email or Username" autocomplete="email">
          <span class="icon">
            <svg viewBox="0 0 24 24"><path d="M2 5h20v14H2z"/><path class="cut" d="M2.5 5.5 12 13.5l9.5-8"/></svg>
          </span>
        </div>
        <small class="error" id="emailError"></small>
      </div>

      <div class="field">
        <div class="input-wrap">
          <input type="password" id="password" placeholder="Password" autocomplete="new-password">
          <button type="button" class="icon toggle" aria-label="Show password" data-target="password"></button>
        </div>
        <small class="error" id="passwordError"></small>
      </div>

      <div class="field">
        <div class="input-wrap">
          <input type="password" id="confirmPassword" placeholder="Confirm Password" autocomplete="new-password">
          <button type="button" class="icon toggle" aria-label="Show password" data-target="confirmPassword"></button>
        </div>
        <small class="error" id="confirmPasswordError"></small>
      </div>

      <div class="field tight">
        <label class="check"><input type="checkbox" id="terms"><span class="box"></span>I agree to the <a href="#" class="link" id="termsLink">Terms &amp; Conditions</a></label>
        <small class="error" id="termsError"></small>
      </div>

      <div class="message" id="formMessage" role="alert"></div>

      <button type="submit" class="btn">Create Account</button>
      <p class="switch">Already have an account? <a href="index.php" class="link">Log in</a></p>
    </form>
  </main>
  <script src="validation.js"></script>
  <script src="auth.js"></script>
</body>
</html>