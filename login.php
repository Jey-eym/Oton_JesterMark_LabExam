<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Almendra:ital,wght@0,400;0,700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="background.css">
</head>
<body data-page="login">
  <main class="page">
    <h1 class="title">Find peace in the present<br>moment of your life.</h1>

    <form id="loginForm" class="form" novalidate>
      <div class="field">
        <div class="input-wrap">
          <input type="text" id="identifier" placeholder="Email or Username" autocomplete="username">
          <span class="icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="4.2"/><path d="M3.5 21c0-4.6 3.8-7.5 8.5-7.5s8.5 2.9 8.5 7.5z"/></svg>
          </span>
        </div>
        <small class="error" id="identifierError"></small>
      </div>

      <div class="field">
        <div class="input-wrap">
          <input type="password" id="password" placeholder="Password" autocomplete="current-password">
          <button type="button" class="icon toggle" aria-label="Show password" data-target="password"></button>
        </div>
        <small class="error" id="passwordError"></small>
      </div>

      <div class="row">
        <label class="check"><input type="checkbox" id="remember"><span class="box"></span>Remember me</label>
        <a href="#" id="forgot" class="link">Forget password?</a>
      </div>

      <div class="message" id="formMessage" role="alert"></div>

      <button type="submit" class="btn">Login</button>
      <p class="switch">Don't have account? <a href="register.php" class="link">Sign up</a></p>
    </form>
  </main>
  <script src="validation.js"></script>
  <script src="auth.js"></script>
</body>
</html>