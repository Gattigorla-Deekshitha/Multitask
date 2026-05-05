from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Member, Task
from .serializers import ProjectSerializer, MemberSerializer, TaskSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

# Projects
@api_view(['GET', 'POST'])
def project_list_create(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = {
            'name': request.data.get('name'),
            'description': request.data.get('description'),
            'deadline': request.data.get('deadline'),
            'status': request.data.get('status', 'Pending')
        }
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = {
            'name': request.data.get('name', project.name),
            'description': request.data.get('description', project.description),
            'deadline': request.data.get('deadline', project.deadline),
            'status': request.data.get('status', project.status)
        }
        serializer = ProjectSerializer(project, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Members
@api_view(['GET', 'POST'])
def member_list_create(request):
    if request.method == 'GET':
        members = Member.objects.all()
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = {
            'name': request.data.get('name'),
            'email': request.data.get('email'),
            'member_code': request.data.get('member_code'),
            'role': request.data.get('role', 'Member')
        }
        serializer = MemberSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def member_detail(request, pk):
    try:
        member = Member.objects.get(pk=pk)
    except Member.DoesNotExist:
        return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MemberSerializer(member)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = {
            'name': request.data.get('name', member.name),
            'email': request.data.get('email', member.email),
            'member_code': request.data.get('member_code', member.member_code),
            'role': request.data.get('role', member.role)
        }
        serializer = MemberSerializer(member, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Tasks
@api_view(['GET', 'POST'])
def task_list_create(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'project': request.data.get('project'),
            'assigned_member': request.data.get('assigned_member'),
            'deadline': request.data.get('deadline'),
            'priority': request.data.get('priority', 'Medium'),
            'status': request.data.get('status', 'Pending')
        }
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = {
            'title': request.data.get('title', task.title),
            'description': request.data.get('description', task.description),
            'project': request.data.get('project', task.project.id),
            'assigned_member': request.data.get('assigned_member', task.assigned_member.id if task.assigned_member else None),
            'deadline': request.data.get('deadline', task.deadline),
            'priority': request.data.get('priority', task.priority),
            'status': request.data.get('status', task.status)
        }
        serializer = TaskSerializer(task, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Dashboard
@api_view(['GET'])
def dashboard_stats(request):
    member_id = request.query_params.get('member_id')
    
    if member_id:
        tasks = Task.objects.filter(assigned_member_id=member_id)
        project_ids = tasks.values_list('project_id', flat=True).distinct()
        projects = Project.objects.filter(id__in=project_ids)
        
        # Calculate project progress
        projects_data = []
        for project in projects:
            p_tasks = Task.objects.filter(project=project, assigned_member_id=member_id)
            total = p_tasks.count()
            completed = p_tasks.filter(status='Completed').count()
            progress = int((completed / total) * 100) if total > 0 else 0
            projects_data.append({'name': project.name, 'progress': progress, 'deadline': project.deadline})

        data = {
            'total_projects': project_ids.count(),
            'total_tasks': tasks.count(),
            'completed_tasks': tasks.filter(status='Completed').count(),
            'pending_tasks': tasks.filter(status='Pending').count(),
            'overdue_tasks': tasks.filter(status='Overdue').count(),
            'total_members': 0,
            'recent_activities': [
                {'title': f'Task "{t.title}" assigned', 'time': t.deadline} 
                for t in tasks.order_by('-id')[:5]
            ],
            'projects_progress': projects_data[:3]
        }
    else:
        # Admin Global Stats
        all_tasks = Task.objects.all()
        all_projects = Project.objects.all()
        
        projects_data = []
        for project in all_projects:
            p_tasks = all_tasks.filter(project=project)
            total = p_tasks.count()
            completed = p_tasks.filter(status='Completed').count()
            progress = int((completed / total) * 100) if total > 0 else 0
            projects_data.append({'name': project.name, 'progress': progress, 'deadline': project.deadline})

        data = {
            'total_projects': all_projects.count(),
            'total_tasks': all_tasks.count(),
            'completed_tasks': all_tasks.filter(status='Completed').count(),
            'pending_tasks': all_tasks.filter(status='Pending').count(),
            'overdue_tasks': all_tasks.filter(status='Overdue').count(),
            'total_members': Member.objects.count(),
            'recent_activities': [
                {'title': f'Task "{t.title}" updated', 'time': t.deadline} 
                for t in all_tasks.order_by('-id')[:5]
            ],
            'projects_progress': projects_data[:3]
        }
    return Response(data)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    member_code = request.data.get('member_code')

    # Case 1: Admin Login (Email/Password)
    if email and password:
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            username = email

        user = authenticate(username=username, password=password)
        if user is not None:
            return Response({
                'access': 'admin-token',
                'user': {
                    'name': user.get_full_name() or user.username,
                    'role': 'Admin'
                }
            })
        return Response({'error': 'Invalid Admin credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    # Case 2: Member Login (Member Code)
    elif member_code:
        try:
            member = Member.objects.get(member_code=member_code)
            return Response({
                'user': {
                    'id': member.id,
                    'name': member.name,
                    'role': member.role,
                    'email': member.email
                },
                'access': 'dummy-member-token'
            })
        except Member.DoesNotExist:
            return Response({'error': 'Invalid Member Code'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({'error': 'Please provide either credentials or a member code'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def change_password(request):
    email = request.data.get('email')
    new_password = request.data.get('new_password')
    
    if not email or not new_password:
        return Response({'error': 'Missing email or new password'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'Admin user not found'}, status=status.HTTP_404_NOT_FOUND)