import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase();

    let items = crmStore.knowledge;

    if (category && category !== 'all') {
      items = items.filter(k => k.category === category);
    }

    if (q) {
      items = items.filter(k => 
        k.title.toLowerCase().includes(q) || 
        k.content.toLowerCase().includes(q) ||
        (k.fileName && k.fileName.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch knowledge items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, fileName, fileSize, fileType } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và nội dung không được để trống' },
        { status: 400 }
      );
    }

    const newItem = crmStore.addKnowledge({
      title: title.trim(),
      content: content.trim(),
      category: category || 'Cá Nhân',
      fileName,
      fileSize,
      fileType
    });

    return NextResponse.json({
      success: true,
      data: newItem
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create knowledge item' },
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
        { success: false, error: 'Knowledge ID required' },
        { status: 400 }
      );
    }

    const deleted = crmStore.deleteKnowledge(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Đã xóa tài liệu' : 'Không tìm thấy tài liệu'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete knowledge item' },
      { status: 500 }
    );
  }
}
