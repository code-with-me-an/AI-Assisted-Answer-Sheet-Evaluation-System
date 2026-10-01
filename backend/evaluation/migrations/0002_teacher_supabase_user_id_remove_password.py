# Generated for the Supabase Auth migration.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evaluation', '0001_initial'),
    ]

    operations = [
        # Nullable first: existing teacher rows can be linked safely by the
        # profile-sync endpoint after the matching Supabase user signs in.
        migrations.AddField(
            model_name='teacher',
            name='supabase_user_id',
            field=models.UUIDField(blank=True, null=True, unique=True),
        ),
        migrations.RemoveField(
            model_name='teacher',
            name='password',
        ),
    ]
