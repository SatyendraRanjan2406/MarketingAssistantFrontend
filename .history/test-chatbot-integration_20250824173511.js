#!/usr/bin/env node

/**
 * Test script for Google Ads Chatbot API Integration
 * This script demonstrates how to use the chatbot API endpoints
 */

const API_BASE_URL = 'http://localhost:8000';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2MDMyODg5LCJpYXQiOjE3NTYwMjkyODksImp0aSI6IjU1ZjNkNjZhNmM5ODQ4MTM5ZWE2OWNhYTZkZjA5YmU1IiwidXNlcl9pZCI6IjIifQ.xmP-CBK8XaCJBpPsAf83-9yyHoeiwaFvIMElL4RTT8g';

async function testChatbotIntegration() {
  console.log('🤖 Testing Google Ads Chatbot Integration\n');

  try {
    // Step 1: Create a new chat session
    console.log('📝 Step 1: Creating chat session...');
    const sessionResponse = await fetch(`${API_BASE_URL}/google-ads-new/api/chat/sessions/create/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        title: `Test Session ${new Date().toISOString()}`
      })
    });

    if (!sessionResponse.ok) {
      throw new Error(`Failed to create session: ${sessionResponse.status}`);
    }

    const sessionData = await sessionResponse.json();
    console.log('✅ Session created successfully');
    console.log(`   Session ID: ${sessionData.session_id}`);
    console.log(`   Message: ${sessionData.message}\n`);

    // Step 2: Send a test message
    console.log('💬 Step 2: Sending test message...');
    const messageResponse = await fetch(`${API_BASE_URL}/google-ads-new/api/chat/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        message: 'Show me my campaigns',
        session_id: sessionData.session_id
      })
    });

    if (!messageResponse.ok) {
      throw new Error(`Failed to send message: ${messageResponse.status}`);
    }

    const messageData = await messageResponse.json();
    console.log('✅ Message sent successfully');
    console.log(`   Response success: ${messageData.success}`);
    console.log(`   Session ID: ${messageData.session_id}`);
    
    if (messageData.response?.blocks) {
      console.log('   Response blocks:');
      messageData.response.blocks.forEach((block, index) => {
        console.log(`     Block ${index + 1}: ${block.type}`);
        if (block.type === 'text' && block.content) {
          console.log(`       Content: ${block.content}`);
        }
        if (block.type === 'actions' && block.items) {
          console.log(`       Actions: ${block.items.map(item => item.label).join(', ')}`);
        }
      });
    }

    if (messageData.intent) {
      console.log(`   Intent: ${messageData.intent.action} (Confidence: ${Math.round(messageData.intent.confidence * 100)}%)`);
      console.log(`   Requires auth: ${messageData.intent.requires_auth}`);
    }

    console.log('\n🎉 Integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Chat session created');
    console.log('   - Message sent and response received');
    console.log('   - Response parsed and displayed');
    console.log('   - Frontend integration ready');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Ensure the backend server is running on localhost:8000');
    console.log('   2. Check if the access token is valid and not expired');
    console.log('   3. Verify the API endpoints are accessible');
    console.log('   4. Check browser console for any CORS issues');
  }
}

// Run the test
testChatbotIntegration();
