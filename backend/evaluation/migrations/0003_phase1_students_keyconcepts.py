from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [('evaluation', '0002_teacher_supabase_user_id_remove_password')]

    operations = [
        migrations.AddField(
            model_name='question', name='question_type',
            field=models.CharField(default='descriptive', max_length=30),
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('student_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('full_name', models.CharField(max_length=100)),
                ('roll_number', models.CharField(max_length=50)),
                ('email', models.EmailField(blank=True, max_length=150)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='students', to='evaluation.teacher')),
            ],
        ),
        migrations.CreateModel(
            name='ExamStudent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assigned_at', models.DateTimeField(auto_now_add=True)),
                ('examination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='evaluation.examination')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exam_assignments', to='evaluation.student')),
            ],
        ),
        migrations.CreateModel(
            name='KeyConcept',
            fields=[
                ('key_concept_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('concept_text', models.CharField(max_length=255)),
                ('reference_answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='key_concepts', to='evaluation.referenceanswer')),
            ],
        ),
        migrations.AddField(
            model_name='answersheet', name='student',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='answer_sheets', to='evaluation.student'),
        ),
        migrations.AddConstraint(model_name='student', constraint=models.UniqueConstraint(fields=('teacher', 'roll_number'), name='unique_teacher_roll_number')),
        migrations.AddConstraint(model_name='examstudent', constraint=models.UniqueConstraint(fields=('examination', 'student'), name='unique_exam_student_assignment')),
        migrations.AddConstraint(model_name='keyconcept', constraint=models.UniqueConstraint(fields=('reference_answer', 'concept_text'), name='unique_reference_key_concept')),
    ]
