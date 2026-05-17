from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('file_url', models.URLField(max_length=1000)),
                ('file_type', models.CharField(blank=True, max_length=50)),
                ('folder', models.CharField(default='root', max_length=255)),
                ('size_bytes', models.BigIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='file_items', to='users.user')),
            ],
            options={'ordering': ['-updated_at']},
        ),
        migrations.AddIndex(model_name='fileitem', index=models.Index(fields=['owner', 'folder'], name='files_filei_owner_i_7dbf4a_idx')),
        migrations.AddIndex(model_name='fileitem', index=models.Index(fields=['owner', 'name'], name='files_filei_owner_i_a9a18f_idx')),
    ]
