from rest_framework import serializers
from .models import Project, Member, Task

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.ReadOnlyField(source='project.name')
    assigned_member_name = serializers.ReadOnlyField(source='assigned_member.name')

    class Meta:
        model = Task
        fields = '__all__'
