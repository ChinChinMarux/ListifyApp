<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Tampilkan semua task, dengan filter & urut opsional
    public function index(Request $request)
    {
        $query = Task::query();

        if ($request->has('completed')) {
            $query->where('is_completed', $request->completed);
        }

        if ($request->has('sort')) {
            $query->orderBy('created_at', $request->sort);
        }

        return response()->json($query->get());
    }

    // Tambah task baru
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($task, 201);
    }

    // Update task
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $task->update($request->only(['title', 'description', 'is_completed']));

        return response()->json($task);
    }

    // Hapus task
    public function destroy($id)
    {
        Task::findOrFail($id)->delete();

        return response()->json(['message' => 'Task deleted']);
    }

    // Tandai task selesai atau tidak
    public function toggleComplete($id)
    {
        $task = Task::findOrFail($id);
        $task->is_completed = !$task->is_completed;
        $task->save();

        return response()->json($task);
    }
}
