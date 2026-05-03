from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Project, Member, Task

class MultiTaskAPITests(APITestCase):

    def setUp(self):
        # Create initial data for testing
        self.project = Project.objects.create(
            name="Test Project",
            description="Test Description",
            deadline="2026-12-31",
            status="Pending"
        )
        self.member = Member.objects.create(
            name="John Doe",
            email="john@example.com",
            role="Member"
        )
        self.task = Task.objects.create(
            title="Test Task",
            description="Task Description",
            project=self.project,
            assigned_member=self.member,
            deadline="2026-12-31",
            priority="Medium",
            status="Pending"
        )

    # Project Tests
    def test_get_projects(self):
        url = reverse('project-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_project(self):
        url = reverse('project-list-create')
        data = {
            "name": "New Project",
            "description": "New Desc",
            "deadline": "2026-06-01",
            "status": "In Progress"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)

    def test_update_project(self):
        url = reverse('project-detail', args=[self.project.id])
        data = {"name": "Updated Project Name"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, "Updated Project Name")

    def test_delete_project(self):
        url = reverse('project-detail', args=[self.project.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    # Member Tests
    def test_get_members(self):
        url = reverse('member-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_member(self):
        url = reverse('member-list-create')
        data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "role": "Admin"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Member.objects.count(), 2)

    # Task Tests
    def test_get_tasks(self):
        url = reverse('task-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_task(self):
        url = reverse('task-list-create')
        data = {
            "title": "New Task",
            "description": "New Task Desc",
            "project": self.project.id,
            "assigned_member": self.member.id,
            "deadline": "2026-05-01",
            "priority": "High",
            "status": "Pending"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)

    # Dashboard Tests
    def test_dashboard_stats(self):
        url = reverse('dashboard-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_projects'], 1)
        self.assertEqual(response.data['total_tasks'], 1)
        self.assertEqual(response.data['total_members'], 1)
