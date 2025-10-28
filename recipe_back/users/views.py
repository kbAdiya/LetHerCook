from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['POST'])
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    User.objects.create_user(username=username, password=password)
    return Response({"message": "User created successfully"})

@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)  
        return Response({"username": user.username})  
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
