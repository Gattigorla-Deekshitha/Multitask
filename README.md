MultiTask – Full Stack Team Task Manager

A full-stack task management application built to streamline team collaboration by enabling project creation, task assignment, and progress tracking.

Overview

MultiTask helps teams organize workflows by allowing administrators to manage projects, assign tasks to team members, and monitor task completion through a centralized dashboard.

---

Features

- Project creation and management
- Team member management
- Task assignment system
- Task status tracking
- Priority management
- Dashboard analytics
- Overdue task tracking
- Responsive UI design

---

Tech Stack

Frontend

- React.js
- Tailwind CSS
- shadcn/ui
- Axios
- React Router DOM

Backend

- Django
- Django REST Framework
- Function-Based Views

Database

- MySQL

Deployment

- Railway

---

System Architecture

Frontend (React)
      ↓
REST APIs (Django REST Framework)
      ↓
MySQL Database

---

Database Schema

Members

- member_id
- member_name
- email
- role

Projects

- project_id
- project_name
- description
- start_date
- end_date
- status

Tasks

- task_id
- task_name
- description
- priority
- status
- deadline
- project_id
- member_id

---

Installation & Setup

Clone Repository

git clone https://github.com/Gattigorla-Deekshitha/multitask.git
cd multitask

Backend Setup

cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend Setup

cd frontend
npm install
npm run dev

---

API Endpoints

Method| Endpoint| Description
GET| /projects/| Fetch all projects
POST| /projects/create/| Create project
GET| /members/| Fetch members
POST| /tasks/create/| Create task
GET| /dashboard/| Dashboard statistics

---

Deployment

The application is deployed on Railway and configured for production use.

---

Future Enhancements

- Authentication system
- Real-time notifications
- File attachments
- Team chat integration

---

Author

Deekshitha
Full Stack Developer
