import { sequelize } from '../config/database.js';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

async function seedDatabase() {
  try {
    console.log('🔄 Starting database seed...');

    // Connect to database first
    if (!sequelize) {
      throw new Error('Sequelize not initialized');
    }

    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database (clear all data)
    await sequelize.sync({ force: true });
    console.log('✅ Database cleared and tables recreated');

    // Create 3 teams with members
    const team1 = await Team.create({
      name: 'Shubham Team',
      description: 'Team led by Shubham',
      owner: 'shubham1',
      isPublic: true,
      members: [
        {
          userId: 'shubham1',
          name: 'Shubham',
          whatsappNumber: '919049874780',
          role: 'Project Lead',
          joinedAt: '2026-01-01'
        }
      ]
    });
    console.log('✅ Created Team 1: Shubham Team');

    const team2 = await Team.create({
      name: 'Mehul Team',
      description: 'Team led by Mehul',
      owner: 'mehul1',
      isPublic: true,
      members: [
        {
          userId: 'mehul1',
          name: 'Mehul',
          whatsappNumber: '918830451504',
          role: 'Technical Lead',
          joinedAt: '2026-01-01'
        }
      ]
    });
    console.log('✅ Created Team 2: Mehul Team');

    const team3 = await Team.create({
      name: 'Mahesh Team',
      description: 'Team led by Mahesh',
      owner: 'mahesh1',
      isPublic: true,
      members: [
        {
          userId: 'mahesh1',
          name: 'Mahesh',
          whatsappNumber: '917887868580',
          role: 'Development Lead',
          joinedAt: '2026-01-01'
        }
      ]
    });
    console.log('✅ Created Team 3: Mahesh Team');

    // Create 3 projects (assign to teams)
    const project1 = await Project.create({
      name: 'AGB IT',
      description: 'This is a parent site',
      team: team1.id,
      status: 'active',
      priority: 'high',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      owner: 'shubham1',
      isPublic: true
    });
    console.log('✅ Created Project 1: AGB IT');

    const project2 = await Project.create({
      name: 'Market Mantra',
      description: 'Automated futuristic algo trading',
      team: team2.id,
      status: 'active',
      priority: 'high',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      owner: 'mehul1',
      isPublic: true
    });
    console.log('✅ Created Project 2: Market Mantra');

    const project3 = await Project.create({
      name: 'Rathi',
      description: 'Futuristic, private but local first travel experience. Book a rathi travel Guide',
      team: team3.id,
      status: 'active',
      priority: 'medium',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-09-30'),
      owner: 'mahesh1',
      isPublic: true
    });
    console.log('✅ Created Project 3: Rathi');

    // Create some test tasks with mentions
    const task1 = await Task.create({
      title: 'Setup project architecture',
      description: 'Define the overall architecture for AGB IT parent site including microservices structure',
      project: project1.id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date('2026-01-15'),
      tags: ['architecture', 'planning'],
      mentionedMembers: [
        {
          userId: 'shubham1',
          name: 'Shubham',
          whatsappNumber: '919049874780'
        },
        {
          userId: 'mehul1',
          name: 'Mehul',
          whatsappNumber: '918830451504'
        }
      ]
    });
    console.log('✅ Created Task 1: Setup project architecture (AGB IT)');

    const task2 = await Task.create({
      title: 'Implement trading algorithm',
      description: 'Develop the core trading algorithm with ML-based predictions',
      project: project2.id,
      status: 'to-do',
      priority: 'high',
      dueDate: new Date('2026-01-20'),
      tags: ['algorithm', 'ml', 'trading'],
      mentionedMembers: [
        {
          userId: 'mehul1',
          name: 'Mehul',
          whatsappNumber: '918830451504'
        },
        {
          userId: 'shubham1',
          name: 'Shubham',
          whatsappNumber: '919049874780'
        }
      ]
    });
    console.log('✅ Created Task 2: Implement trading algorithm (Market Mantra)');

    const task3 = await Task.create({
      title: 'Design travel guide booking interface',
      description: 'Create a user-friendly interface for booking local travel guides with real-time availability',
      project: project3.id,
      status: 'to-do',
      priority: 'medium',
      dueDate: new Date('2026-01-25'),
      tags: ['ui', 'design', 'booking'],
      mentionedMembers: [
        {
          userId: 'mahesh1',
          name: 'Mahesh',
          whatsappNumber: '917887868580'
        },
        {
          userId: 'shubham1',
          name: 'Shubham',
          whatsappNumber: '919049874780'
        }
      ]
    });
    console.log('✅ Created Task 3: Design travel guide booking interface (Rathi)');

    const task4 = await Task.create({
      title: 'API development for parent site',
      description: 'Build RESTful APIs for all child sites to communicate with parent',
      project: project1.id,
      status: 'to-do',
      priority: 'high',
      dueDate: new Date('2026-01-18'),
      tags: ['api', 'backend'],
      mentionedMembers: [
        {
          userId: 'shubham1',
          name: 'Shubham',
          whatsappNumber: '919049874780'
        },
        {
          userId: 'mehul1',
          name: 'Mehul',
          whatsappNumber: '918830451504'
        },
        {
          userId: 'mahesh1',
          name: 'Mahesh',
          whatsappNumber: '917887868580'
        }
      ]
    });
    console.log('✅ Created Task 4: API development (AGB IT) - All members mentioned');

    const task5 = await Task.create({
      title: 'Risk management module',
      description: 'Implement risk assessment and management features for algo trading',
      project: project2.id,
      status: 'to-do',
      priority: 'high',
      dueDate: new Date('2026-01-30'),
      tags: ['risk', 'trading', 'security'],
      mentionedMembers: [
        {
          userId: 'mehul1',
          name: 'Mehul',
          whatsappNumber: '918830451504'
        }
      ]
    });
    console.log('✅ Created Task 5: Risk management module (Market Mantra)');

    const task6 = await Task.create({
      title: 'Implement local-first data sync',
      description: 'Build offline-first architecture with data synchronization for travel booking',
      project: project3.id,
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date('2026-02-05'),
      tags: ['offline', 'sync', 'architecture'],
      mentionedMembers: [
        {
          userId: 'mahesh1',
          name: 'Mahesh',
          whatsappNumber: '917887868580'
        },
        {
          userId: 'mehul1',
          name: 'Mehul',
          whatsappNumber: '918830451504'
        }
      ]
    });
    console.log('✅ Created Task 6: Local-first data sync (Rathi)');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 3 Teams created (Shubham, Mehul, Mahesh)');
    console.log('  - 3 Projects created (AGB IT, Market Mantra, Rathi)');
    console.log('  - 6 Tasks created with various member mentions');
    console.log('\n🚀 Server is ready for testing!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
