import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase();

    let list = crmStore.skills;

    if (category && category !== 'all') {
      list = list.filter(s => s.category === category);
    }

    if (q) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q)
      );
    }

    const counts = {
      all: crmStore.skills.length,
      custom: crmStore.skills.filter(s => s.category === 'Tự tạo').length,
      sales: crmStore.skills.filter(s => s.category === 'Bán hàng').length,
      system: crmStore.skills.filter(s => s.category === 'Hệ thống').length,
    };

    return NextResponse.json({
      success: true,
      data: list,
      counts
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
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
        { success: false, error: 'Skill ID required' },
        { status: 400 }
      );
    }

    const updated = crmStore.toggleSkill(id);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to toggle skill' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category = 'Tự tạo', instructionPrompt } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tên skill không được để trống' },
        { status: 400 }
      );
    }

    const newSkill = crmStore.addSkill({
      name: name.trim(),
      description: description?.trim() || '',
      category,
      icon: 'Sliders',
      scenariosCount: 0,
      referencesCount: 0,
      isEnabled: true,
      instructionPrompt
    });

    return NextResponse.json({
      success: true,
      data: newSkill
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
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
        { success: false, error: 'Skill ID required' },
        { status: 400 }
      );
    }

    const deleted = crmStore.deleteSkill(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Đã xóa skill' : 'Không thể xóa skill hệ thống hoặc không tìm thấy'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
