from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.project_list_create, name='project-list-create'),
    path('projects/<int:pk>/', views.project_detail, name='project-detail'),
    path('members/', views.member_list_create, name='member-list-create'),
    path('members/<int:pk>/', views.member_detail, name='member-detail'),
    path('tasks/', views.task_list_create, name='task-list-create'),
    path('tasks/<int:pk>/', views.task_detail, name='task-detail'),
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
    path('login/', views.login_view, name='login'),
]
