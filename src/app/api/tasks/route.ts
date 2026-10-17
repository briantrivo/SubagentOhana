import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: crmStore.tasks,
      total: crmStore.tasks.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scheduled tasks' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const updated = crmStore.toggleTask(id);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to toggle task' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, schedule, nextRun, category, actionPrompt } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề nhiệm vụ không được để trống' },
        { status: 400 }
      );
    }

    const newTask = crmStore.addTask({
      title: title.trim(),
      description: description?.trim() || 'Nhiệm vụ tự động chạy định kỳ cho trợ lý AI.',
      schedule: schedule || 'Mỗi ngày',
      nextRun: nextRun || 'Ngày mai 09:00',
      lastRun: 'Chưa chạy',
      isEnabled: true,
      category: category || 'Chung',
      actionPrompt
    });

    return NextResponse.json({
      success: true,
      data: newTask
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const deleted = crmStore.deleteTask(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Đã xóa nhiệm vụ' : 'Không tìm thấy nhiệm vụ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
