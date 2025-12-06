from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
import re

def validate_password(password):
    """Validate password meets requirements"""
    errors = []
    
    if len(password) < 12:
        errors.append("Password must be at least 12 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'[0-9]', password):
        errors.append("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
    
    return errors

def validate_email(email):
    """Validate email contains @ symbol"""
    if not email:
        return False
    return '@' in email

@api_view(['POST'])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    password_confirm = request.data.get("password_confirm")

    # Check required fields
    if not username or not password or not email:
        return Response({"error": "Username, email, and password are required"}, status=400)

    # Validate email
    if not validate_email(email):
        return Response({"error": "Email must contain '@' symbol"}, status=400)

    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    # Check if email already exists
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    # Check password confirmation
    if password != password_confirm:
        return Response({"error": "Passwords do not match"}, status=400)

    # Validate password strength
    password_errors = validate_password(password)
    if password_errors:
        return Response({"error": "; ".join(password_errors)}, status=400)

    try:
        User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        return Response({"message": "User created successfully", "success": True})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=400)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)  
        return Response({"username": user.username, "success": True})  
    else:
        return Response({"error": "Invalid username or password"}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def user_profile(request):
    return Response({
        "username": request.user.username,
        "message": "You are authenticated"
    })


@api_view(['POST'])
def logout_user(request):
    logout(request)  
    return Response({"message": "Logged out successfully"})
