from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt import views as jwt_views
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

from byutest.views import main as views

# ----------------------------------------------------------------------

urlpatterns = [

    path('admin/', admin.site.urls),

    # ----------------------------------------------------------------------

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)