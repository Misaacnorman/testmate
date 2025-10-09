# Data Isolation Testing Guide

## Overview
This guide helps you test that data from different laboratories is properly isolated and cannot be accessed across laboratory boundaries.

## Testing Strategy

### 1. Create Test Laboratories
1. Create two separate user accounts with different email addresses
2. Complete the signup process for both accounts
3. Note the laboratory IDs for each account

### 2. Test Data Isolation

#### A. Test Register Data Isolation
1. **Login as Laboratory A user**
   - Go to Registers → Concrete Cubes
   - Add a test entry with unique data (e.g., client name "Lab A Test")
   - Note the entry ID

2. **Login as Laboratory B user**
   - Go to Registers → Concrete Cubes
   - Verify you cannot see the entry from Laboratory A
   - Add a test entry with different data (e.g., client name "Lab B Test")

3. **Switch back to Laboratory A**
   - Verify you can only see Laboratory A's entries
   - Verify you cannot see Laboratory B's entries

#### B. Test User Data Isolation
1. **Login as Laboratory A user**
   - Go to Personnel page
   - Verify you only see users from Laboratory A
   - Add a new user to Laboratory A

2. **Login as Laboratory B user**
   - Go to Personnel page
   - Verify you cannot see users from Laboratory A
   - Verify you only see users from Laboratory B

#### C. Test Project Data Isolation
1. **Login as Laboratory A user**
   - Go to Projects page
   - Create a project with unique name
   - Note the project details

2. **Login as Laboratory B user**
   - Go to Projects page
   - Verify you cannot see projects from Laboratory A
   - Create a project with different details

### 3. Test Security Rules

#### A. Test Direct Firestore Access
1. Open browser developer tools
2. Try to access Firestore directly with different laboratory IDs
3. Verify that queries are automatically filtered by laboratory

#### B. Test API Endpoints
1. Try to access data with different laboratory contexts
2. Verify that unauthorized access is blocked

### 4. Test Edge Cases

#### A. Test Missing Laboratory Context
1. Create a user without proper laboratory assignment
2. Verify that data access is blocked
3. Verify appropriate error messages are shown

#### B. Test Laboratory Switching
1. If a user is moved between laboratories
2. Verify old data is no longer accessible
3. Verify new laboratory data is accessible

## Expected Results

### ✅ Success Indicators
- Users can only see data from their assigned laboratory
- No data leakage between laboratories
- Appropriate error messages for unauthorized access
- Security rules prevent cross-laboratory data access

### ❌ Failure Indicators
- Users can see data from other laboratories
- Security rules allow unauthorized access
- Missing laboratory context doesn't block access
- Data appears in wrong laboratory context

## Debugging Tips

### 1. Check Browser Console
- Look for Firestore permission errors
- Check for laboratory context warnings
- Monitor network requests for proper filtering

### 2. Check Firestore Rules
- Verify rules are deployed correctly
- Test rules in Firebase Console
- Check rule evaluation logs

### 3. Check Application Logs
- Look for laboratory context validation errors
- Check for data filtering warnings
- Monitor authentication state changes

## Security Checklist

- [ ] All collections have laboratory-based security rules
- [ ] All queries include laboratory filtering
- [ ] User authentication includes laboratory context
- [ ] Data creation includes laboratory ID
- [ ] Cross-laboratory access is blocked
- [ ] Error handling prevents data leakage
- [ ] Migration script adds laboratory IDs to existing data

## Maintenance

### Regular Testing
- Test data isolation after each deployment
- Verify security rules are working correctly
- Check for new data leakage points
- Test with multiple laboratory accounts

### Monitoring
- Monitor Firestore security rule violations
- Check for unauthorized access attempts
- Review data access patterns
- Monitor laboratory context errors
