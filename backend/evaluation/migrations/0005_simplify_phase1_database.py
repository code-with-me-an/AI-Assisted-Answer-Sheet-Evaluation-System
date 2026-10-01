import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evaluation', '0004_evaluation_is_reviewed_evaluation_status_and_more'),
    ]

    operations = [
        # 1. Clean up legacy tables
        migrations.DeleteModel(
            name='KeyConcept',
        ),
        migrations.DeleteModel(
            name='ExtractedAnswer',
        ),

        # 2. Clean up Evaluation fields
        migrations.RemoveField(
            model_name='evaluation',
            name='answer_sheet',
        ),
        migrations.RemoveField(
            model_name='evaluation',
            name='concept_score',
        ),
        migrations.RemoveField(
            model_name='evaluation',
            name='nli_score',
        ),
        migrations.RemoveField(
            model_name='evaluation',
            name='completeness_score',
        ),
        migrations.RemoveField(
            model_name='evaluation',
            name='correctness_score',
        ),
        migrations.RemoveField(
            model_name='evaluation',
            name='student_answer',
        ),
        migrations.RenameField(
            model_name='evaluation',
            old_name='student_answer_record',
            new_name='student_answer',
        ),
        migrations.AlterField(
            model_name='evaluation',
            name='student_answer',
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='evaluation',
                to='evaluation.studentanswer',
            ),
        ),

        # 3. Clean up Result fields
        migrations.RemoveField(
            model_name='result',
            name='answer_sheet',
        ),
        migrations.AlterField(
            model_name='result',
            name='exam_student',
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='result',
                to='evaluation.examstudent',
            ),
        ),

        # 4. Delete AnswerSheet model
        migrations.DeleteModel(
            name='AnswerSheet',
        ),
    ]
