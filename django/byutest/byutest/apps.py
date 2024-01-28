from django.apps import AppConfig
import importlib

class BYUTestConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'byutest'

    # comment back in depending on route we go with video feed processing
    #def ready(self):
    #    video_feed = importlib.import_module('byutest.views.video_feed')
    #    video_source_url = 'http://96.66.39.30:8090/control/userimage.html'
    #    video_feed.start_processing(video_source_url)
