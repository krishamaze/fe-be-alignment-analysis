#!/usr/bin/env pwsh
# Test script to verify sync workflow logic locally

Write-Host "🔍 Testing Sync Workflow Logic" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Test 1: Verify repository access
Write-Host "`n1. Testing repository access..." -ForegroundColor Yellow

try {
    Write-Host "   Checking backend repository..."
    $backendTest = git ls-remote --heads https://github.com/krishamaze/finetune-ERP-backend 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Backend repository accessible" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend repository not accessible" -ForegroundColor Red
        exit 1
    }

    Write-Host "   Checking frontend repository..."
    $frontendTest = git ls-remote --heads https://github.com/krishamaze/finetune-ERP-frontend 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Frontend repository accessible" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend repository not accessible" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error testing repository access: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Verify branch existence
Write-Host "`n2. Testing branch existence..." -ForegroundColor Yellow

try {
    Write-Host "   Checking backend branch 'krishna/implement-phase-a1-admin-api-scaffold'..."
    $backendBranch = git ls-remote --exit-code origin krishna/implement-phase-a1-admin-api-scaffold 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Backend branch exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend branch does not exist" -ForegroundColor Red
        exit 1
    }

    Write-Host "   Checking frontend branch 'feature/dashboard-integration'..."
    Set-Location frontend
    $frontendBranch = git ls-remote --exit-code origin feature/dashboard-integration 2>$null
    Set-Location ..
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Frontend branch exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend branch does not exist" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error testing branch existence: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Check current submodule status
Write-Host "`n3. Checking current submodule status..." -ForegroundColor Yellow

try {
    if (Test-Path "backend/.git") {
        Set-Location backend
        $backendCommit = git rev-parse --short HEAD
        $backendBranch = git branch --show-current
        Write-Host "   Backend: $backendBranch at $backendCommit" -ForegroundColor Cyan
        Set-Location ..
    } else {
        Write-Host "   Backend submodule not initialized" -ForegroundColor Yellow
    }

    if (Test-Path "frontend/.git") {
        Set-Location frontend
        $frontendCommit = git rev-parse --short HEAD
        $frontendBranch = git branch --show-current
        Write-Host "   Frontend: $frontendBranch at $frontendCommit" -ForegroundColor Cyan
        Set-Location ..
    } else {
        Write-Host "   Frontend submodule not initialized" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Error checking submodule status: $_" -ForegroundColor Red
}

Write-Host "`n✅ All tests passed! Workflow should work correctly." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "   1. Ensure PERSONAL_ACCESS_TOKEN secret is configured in GitHub" -ForegroundColor White
Write-Host "   2. Verify the token has access to both repositories" -ForegroundColor White
Write-Host "   3. Test the workflow by triggering it manually" -ForegroundColor White
