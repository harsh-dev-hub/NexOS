from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('description', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='users.user')),
            ],
            options={'ordering': ['-updated_at']},
        ),
        migrations.CreateModel(
            name='ProjectNode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('node_type', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=255)),
                ('path', models.CharField(max_length=1000)),
                ('content', models.TextField(blank=True, default='')),
                ('language', models.CharField(blank=True, default='', max_length=40)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='projects.projectnode')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='nodes', to='projects.project')),
            ],
            options={'ordering': ['path']},
        ),
        migrations.AddIndex(model_name='project', index=models.Index(fields=['owner', 'updated_at'], name='projects_pro_owner_i_0f60ee_idx')),
        migrations.AddIndex(model_name='projectnode', index=models.Index(fields=['project', 'path'], name='projects_pro_project_9a6569_idx')),
        migrations.AddIndex(model_name='projectnode', index=models.Index(fields=['project', 'node_type'], name='projects_pro_project_d06ce6_idx')),
        migrations.AddConstraint(model_name='projectnode', constraint=models.UniqueConstraint(fields=('project', 'path'), name='unique_project_path')),
    ]
