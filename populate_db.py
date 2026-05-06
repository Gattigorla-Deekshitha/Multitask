import os
import django
import sys

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'multitask_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Member, Project, Task
from datetime import date, timedelta

def populate():
    # 1. Create Admin (Superuser)
    if not User.objects.filter(email='admin@gmail.com').exists():
        User.objects.create_superuser('admin', 'admin@gmail.com', 'admin123')
        print("Created Admin User: admin@gmail.com | Password: admin123")
    else:
        print("Admin user already exists.")

    # 2. Create Members
    members_data = [
        {'name': 'Alice Smith', 'email': 'alice@company.com', 'member_code': 'MEM-001', 'role': 'Member'},
        {'name': 'Bob Jones', 'email': 'bob@company.com', 'member_code': 'MEM-002', 'role': 'Member'},
        {'name': 'Bhargavi', 'email': 'bhargavi@company.com', 'member_code': 'MEM-003', 'role': 'Member'},
        {'name': 'Deekshitha', 'email': 'deekshitha@company.com', 'member_code': 'MEM-004', 'role': 'Member'},
    ]
    
    for m in members_data:
        member, created = Member.objects.get_or_create(
            member_code=m['member_code'],
            defaults={'name': m['name'], 'email': m['email'], 'role': m['role']}
        )
        if created:
            print(f"Created Member: {member.name} | Code: {member.member_code}")
        
    # 3. Create Projects
    if not Project.objects.filter(name='Alpha Launch').exists():
        p1 = Project.objects.create(name='Alpha Launch', description='Q3 Product Launch', deadline=date.today() + timedelta(days=45), status='In Progress')
        p2 = Project.objects.create(name='Legacy Cleanup', description='Refactoring old codebase', deadline=date.today() + timedelta(days=10), status='Pending')
        
        print("Created dummy Projects.")

        # 4. Create Tasks
        member1 = Member.objects.get(member_code='MEM-001')
        member2 = Member.objects.get(member_code='MEM-002')

        Task.objects.create(title='Design System', description='Set up Tailwind tokens', project=p1, assigned_member=member1, deadline=date.today() + timedelta(days=5), priority='High', status='Completed')
        Task.objects.create(title='API Integration', description='Connect React with Django', project=p1, assigned_member=member2, deadline=date.today() + timedelta(days=15), priority='High', status='In Progress')
        Task.objects.create(title='Remove old DB tables', description='Drop unused tables', project=p2, assigned_member=member1, deadline=date.today() - timedelta(days=2), priority='Medium', status='Overdue')
        Task.objects.create(title='Update Docs', description='Write API documentation', project=p2, assigned_member=member2, deadline=date.today() + timedelta(days=3), priority='Low', status='Pending')
        
        print("Created dummy Tasks.")
    else:
        print("Dummy Projects & Tasks already exist.")

if __name__ == '__main__':
    populate()
