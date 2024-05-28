
<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
</head>
<body>
    <h1>Email Verification</h1>
    <p>Click the link below to verify your email:</p>
    <a href="{{ url('/api/client/verify', $token) }}">Verify Email</a>
</body>
</html>
