from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExecutionJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(max_length=20)),
                ('source_code', models.TextField()),
                ('stdin', models.TextField(blank=True, default='')),
                ('status', models.CharField(default='queued', max_length=20)),
                ('output', models.TextField(blank=True, default='')),
                ('error', models.TextField(blank=True, default='')),
                ('exit_code', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='execution_jobs', to='users.user')),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.AddIndex(model_name='executionjob', index=models.Index(fields=['owner', 'created_at'], name='execution_o_owner_i_95b1b1_idx')),
        migrations.AddIndex(model_name='executionjob', index=models.Index(fields=['language', 'status'], name='execution_o_languag_3a9225_idx')),
    ]
