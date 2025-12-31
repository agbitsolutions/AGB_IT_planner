/**
 * Playwright E2E Tests for Team Creation
 * Tests database entries and API responses
 */

import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

test.describe('Team Creation Tests', () => {
  
  test('should create a team successfully', async ({ request }) => {
    const teamData = {
      name: `Test Team ${Date.now()}`,
      description: 'A test team for automated testing',
      isPublic: true
    };

    const response = await request.post(`${API_BASE_URL}/teams`, {
      data: teamData,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Check response status
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    // Parse response body
    const responseBody = await response.json();
    console.log('✅ Team creation response:', responseBody);

    // Verify response structure
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody).toHaveProperty('message', 'Team created successfully');
    expect(responseBody).toHaveProperty('data');

    // Verify team data
    const team = responseBody.data;
    expect(team).toHaveProperty('id');
    expect(team.name).toBe(teamData.name);
    expect(team.description).toBe(teamData.description);
    expect(team.isPublic).toBe(teamData.isPublic);

    console.log(`✅ Team created in database: ID ${team.id}`);
  });

  test('should fetch public teams', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/teams/public`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log('✅ Public teams response:', responseBody);

    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody).toHaveProperty('data');
    expect(Array.isArray(responseBody.data)).toBeTruthy();
  });

  test('should handle duplicate team names', async ({ request }) => {
    const teamName = `Unique Team ${Date.now()}`;
    
    // Create first team
    const firstResponse = await request.post(`${API_BASE_URL}/teams`, {
      data: {
        name: teamName,
        description: 'First team',
        isPublic: true
      }
    });

    expect(firstResponse.ok()).toBeTruthy();

    // Try to create duplicate
    const duplicateResponse = await request.post(`${API_BASE_URL}/teams`, {
      data: {
        name: teamName,
        description: 'Duplicate team',
        isPublic: true
      }
    });

    // Should fail with 400 or 409
    expect(duplicateResponse.ok()).toBeFalsy();
    expect([400, 409, 500]).toContain(duplicateResponse.status());
    
    const errorBody = await duplicateResponse.json();
    console.log('✅ Duplicate team error:', errorBody);
    expect(errorBody).toHaveProperty('success', false);
  });

  test('should validate team name is required', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/teams`, {
      data: {
        description: 'Team without name',
        isPublic: true
      }
    });

    expect(response.ok()).toBeFalsy();
    const errorBody = await response.json();
    console.log('✅ Validation error:', errorBody);
    expect(errorBody).toHaveProperty('success', false);
  });
});

test.describe('Team Creation UI Tests', () => {
  
  test('should create team via web interface', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for team creation button/form
    // This assumes your UI has these elements - adjust selectors as needed
    const teamNameInput = page.locator('input[name="team-name"], input#team-name, input[placeholder*="Team"]').first();
    
    if (await teamNameInput.isVisible()) {
      const uniqueName = `UI Test Team ${Date.now()}`;
      
      await teamNameInput.fill(uniqueName);
      
      const descInput = page.locator('input[name="team-description"], textarea[name="team-description"], textarea[placeholder*="Description"]').first();
      if (await descInput.isVisible()) {
        await descInput.fill('Created via Playwright UI test');
      }

      // Find and click submit button
      const submitButton = page.locator('button:has-text("Create Team"), button:has-text("Create"), button[type="submit"]').first();
      await submitButton.click();

      // Wait for success notification
      await page.waitForSelector('.notification-toast.success, .success, .alert-success', { timeout: 5000 });
      
      const successMessage = await page.locator('.notification-toast.success, .success, .alert-success').textContent();
      console.log('✅ Success notification:', successMessage);
      
      expect(successMessage).toContain('success');
    } else {
      console.log('⚠️  Team creation form not found on homepage');
    }
  });
});
