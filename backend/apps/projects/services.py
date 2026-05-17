from django.db import transaction
from .models import Project, ProjectNode


def bootstrap_project(project: Project):
    root = ProjectNode.objects.create(project=project, parent=None, node_type='folder', name='root', path='/')
    ProjectNode.objects.create(project=project, parent=root, node_type='file', name='README.md', path='/README.md', content=f'# {project.name}\n')


@transaction.atomic
def rename_node(node: ProjectNode, new_name: str):
    old_path = node.path
    parent_path = '/'.join(old_path.rstrip('/').split('/')[:-1]) or '/'
    if parent_path == '/':
        new_path = f'/{new_name}'
    else:
        new_path = f'{parent_path}/{new_name}'
    node.name = new_name
    node.path = new_path
    node.save(update_fields=['name', 'path', 'updated_at'])

    if node.node_type == 'folder':
        prefix = old_path.rstrip('/')
        descendants = ProjectNode.objects.filter(project=node.project, path__startswith=f'{prefix}/').exclude(id=node.id)
        for child in descendants:
            child.path = child.path.replace(prefix, new_path, 1)
            child.save(update_fields=['path', 'updated_at'])
