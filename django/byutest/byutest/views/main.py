import random
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from django.db import transaction
import logging
from byutest.views import video_feed

# ----------------------------------------------------------------------

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# ----------------------------------------------------------------------
# Game setup/general views

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    post_data = request.data
    request.user = User.objects.filter(username='admin').first()
    same_email_users = User.objects.filter(email=post_data['email'])
    if len(same_email_users) > 0:
        return Response(
            {"response": "Unable to create new account - email already in use."},
            status=status.HTTP_400_BAD_REQUEST
        )
    same_username_users = User.objects.filter(username=post_data['username'])
    if len(same_username_users) > 0:
        return Response(
            {"response": "Unable to create new account - username already in use."},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        new_user = User.objects.create(
            username=post_data['username'],
            first_name=post_data['firstName'],
            last_name=post_data['lastName'],
            email=post_data['email'],
            is_superuser=False,
            is_staff=False
        )
        new_user.set_password(post_data['password'])
        new_user.last_login = timezone.now()
        new_user.save()

        return Response(gen_jwt_tokens_for_user(new_user))
    except Exception as e:
        return Response(
            {
                "response": "Unable to create new account.",
                "detail": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['POST'])
@permission_classes([AllowAny])
def get_jwt_token(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.get(email=username)

        if user.check_password(password):
            update_last_login(user)
            return Response(gen_jwt_tokens_for_user(user))
        else:
            return Response(
                {"detail": "Incorrect password for this account."},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except User.DoesNotExist:
        return Response(
            {"detail": "No active account found with the given credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except:
        return Response(
            {"detail": "An error occured. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@permission_classes([AllowAny])
def parking_lot_stats(request):
    """
    API endpoint to fetch the latest parking lot statistics.
    """
    stats = video_feed.get_latest_stats()
    return Response(stats)


@api_view(['GET'])
@permission_classes([AllowAny])
def test_image_processing(request):
    """
    API endpoint to fetch the latest parking lot statistics.
    """
    ### Using test images for now, will need to hook up to live video feed and use screenshots of lots
    test_images = ['byutest/data/test_lot1.jpg', 'byutest/data/test_lot2.jpg', 'byutest/data/test_lot3.jpg']
    image_index = random.randint(0, len(test_images) - 1)
    video_feed.test_image(test_images[image_index])
    stats = video_feed.get_latest_stats()
    response = {'stats': stats, 'image': test_images[image_index]}
    return JsonResponse(response)
