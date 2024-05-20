"""rename meditation_name

Revision ID: e870c1dd1d05
Revises: 
Create Date: 2024-05-20 13:38:07.770141

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e870c1dd1d05'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('meditations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('meditation_name', sa.String(), nullable=False))
        batch_op.drop_column('title')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('meditations', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.VARCHAR(), nullable=False))
        batch_op.drop_column('meditation_name')

    # ### end Alembic commands ###
