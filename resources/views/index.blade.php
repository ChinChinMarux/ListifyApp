<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title href="bi bi-bag-check-fill me-2">Listify</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style src="../css/style.css" rel="stylesheet"></style>
</head>

<body>
  <!-- Header -->
  <nav class="navbar navbar-dark px-4 py-3" style="background-color: #d18d00;">
    <span class="navbar-brand fw-bold fs-4"><i class="bi bi-bag-check-fill me-2"></i>Listify</span>
    <div>
      <button class="btn btn-light me-3"><i class="bi bi-calendar3"></i> May 6, 2025</button>
      <button class="btn btn-light"><i class="bi bi-moon-fill"></i></button>
    </div>
  </nav>

  <!-- Main Content -->
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3 sidebar">
        <h5>Categories</h5>
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action active"><i class="bi bi-list-task me-2"></i> All Tasks <span class="badge bg-secondary float-end">0</span></a>
          <a href="#" class="list-group-item list-group-item-action"><i class="bi bi-briefcase me-2 text-primary"></i> Work <span class="badge bg-secondary float-end">0</span></a>
          <a href="#" class="list-group-item list-group-item-action"><i class="bi bi-person-circle me-2 text-success"></i> Personal <span class="badge bg-secondary float-end">0</span></a>
          <a href="#" class="list-group-item list-group-item-action"><i class="bi bi-cart me-2 text-warning"></i> Shopping <span class="badge bg-secondary float-end">0</span></a>
          <a href="#" class="list-group-item list-group-item-action"><i class="bi bi-heart-fill me-2 text-danger"></i> Health <span class="badge bg-secondary float-end">0</span></a>
        </div>

        <!-- Progress -->
        <div class="mt-4">
          <h6>Progress</h6>
          <div class="progress-ring">0%</div>
        </div>
      </div>

      <!-- Main Section -->
      <div class="col-md-9">
        <!-- Add Task -->
        <div class="d-flex gap-2 mb-3">
          <input type="text" class="form-control" placeholder="Add a new task...">
          <select class="form-select w-auto">
            <option>Work</option>
            <option>Personal</option>
          </select>
          <select class="form-select w-auto">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input type="date" class="form-control w-auto">
          <button class="btn btn-add">Add</button>
        </div>

        <!-- Filter -->
        <div class="d-flex align-items-center gap-2 mb-4">
          <span class="fw-semibold">Filter:</span>
          <button class="btn filter-btn active">All</button>
          <button class="btn filter-btn">Active</button>
          <button class="btn filter-btn">Completed</button>
          <select class="form-select w-auto ms-auto">
            <option>Created Date</option>
          </select>
          <button class="btn text-danger">Clear Completed</button>
        </div>

        <!-- Task List -->
        <div class="text-center mt-5 text-muted">
          <i class="bi bi-clipboard fs-1"></i>
          <p class="mt-2 fs-5">No tasks found</p>
          <small>Try changing your filters or add a new task</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../js/script.js"></script>
</body>
</html>