from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from django.http import HttpResponse

def test(request):
    return HttpResponse("Django is Alive!")

urlpatterns = [
    path('test/', test),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^(?!api|admin|test).*$', TemplateView.as_view(template_name='index.html')),
]
