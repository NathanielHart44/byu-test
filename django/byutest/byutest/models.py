from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db.models import signals
from django.core.validators import MaxValueValidator
from django.db import transaction
from django.core.exceptions import ValidationError

# ----------------------------------------------------------------------

