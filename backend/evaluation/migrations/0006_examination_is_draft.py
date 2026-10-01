from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evaluation', '0005_simplify_phase1_database'),
    ]

    operations = [
        migrations.AddField(
            model_name='examination',
            name='is_draft',
            field=models.BooleanField(default=False),
        ),
    ]
