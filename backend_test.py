#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class CuratedClosetAPITester:
    def __init__(self):
        self.base_url = "https://curate-convert.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })
        
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200 and "CuratedCloset API" in response.text
            details = f"Status: {response.status_code}, Response: {response.text}"
            self.log_test("Root API Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root API Endpoint", False, str(e))
            return False
    
    def test_subscribe_valid_email(self):
        """Test subscribing with valid email"""
        test_email = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
        try:
            response = requests.post(
                f"{self.base_url}/subscribe",
                json={"email": test_email},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 200 and response.json().get("success", False)
            details = f"Status: {response.status_code}, Response: {response.json()}"
            self.log_test("Subscribe Valid Email", success, details)
            return success, test_email if success else None
        except Exception as e:
            self.log_test("Subscribe Valid Email", False, str(e))
            return False, None
    
    def test_subscribe_duplicate_email(self, email):
        """Test subscribing with duplicate email"""
        try:
            response = requests.post(
                f"{self.base_url}/subscribe",
                json={"email": email},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = (response.status_code == 200 and 
                      not response.json().get("success", True) and
                      "already registered" in response.json().get("message", "").lower())
            details = f"Status: {response.status_code}, Response: {response.json()}"
            self.log_test("Subscribe Duplicate Email", success, details)
            return success
        except Exception as e:
            self.log_test("Subscribe Duplicate Email", False, str(e))
            return False
    
    def test_subscribe_invalid_email(self):
        """Test subscribing with invalid email"""
        try:
            response = requests.post(
                f"{self.base_url}/subscribe",
                json={"email": "invalid-email"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            # Should return 422 for validation error
            success = response.status_code == 422
            details = f"Status: {response.status_code}, Response: {response.text}"
            self.log_test("Subscribe Invalid Email", success, details)
            return success
        except Exception as e:
            self.log_test("Subscribe Invalid Email", False, str(e))
            return False
    
    def test_get_subscribers(self):
        """Test getting subscribers list"""
        try:
            response = requests.get(f"{self.base_url}/admin/subscribers", timeout=10)
            success = (response.status_code == 200 and 
                      "subscribers" in response.json() and
                      "total" in response.json())
            details = f"Status: {response.status_code}, Total: {response.json().get('total', 'N/A')}"
            self.log_test("Get Subscribers", success, details)
            return success, response.json() if success else None
        except Exception as e:
            self.log_test("Get Subscribers", False, str(e))
            return False, None
    
    def test_export_subscribers(self):
        """Test exporting subscribers to Excel"""
        try:
            response = requests.get(f"{self.base_url}/admin/subscribers/export", timeout=10)
            success = (response.status_code == 200 and 
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" in 
                      response.headers.get("content-type", ""))
            details = f"Status: {response.status_code}, Content-Type: {response.headers.get('content-type', 'N/A')}"
            self.log_test("Export Subscribers", success, details)
            return success
        except Exception as e:
            self.log_test("Export Subscribers", False, str(e))
            return False
    
    def test_delete_subscriber(self, subscriber_id):
        """Test deleting a subscriber"""
        try:
            response = requests.delete(f"{self.base_url}/admin/subscribers/{subscriber_id}", timeout=10)
            success = response.status_code == 200 and response.json().get("success", False)
            details = f"Status: {response.status_code}, Response: {response.json()}"
            self.log_test("Delete Subscriber", success, details)
            return success
        except Exception as e:
            self.log_test("Delete Subscriber", False, str(e))
            return False
    
    def test_track_visit(self):
        """Test tracking page visits"""
        try:
            response = requests.post(f"{self.base_url}/track-visit", timeout=10)
            success = response.status_code == 200 and response.json().get("success", False)
            details = f"Status: {response.status_code}, Response: {response.json()}"
            self.log_test("Track Visit", success, details)
            return success
        except Exception as e:
            self.log_test("Track Visit", False, str(e))
            return False
    
    def test_admin_login_correct_password(self):
        """Test admin login with correct password"""
        try:
            response = requests.post(
                f"{self.base_url}/admin/login",
                json={"password": "curatedcloset2025"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 200 and response.json().get("success", False)
            details = f"Status: {response.status_code}, Response: {response.json()}"
            self.log_test("Admin Login (Correct Password)", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login (Correct Password)", False, str(e))
            return False
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        try:
            response = requests.post(
                f"{self.base_url}/admin/login",
                json={"password": "wrongpassword"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            success = response.status_code == 401  # Should return 401 Unauthorized
            details = f"Status: {response.status_code}, Response: {response.text}"
            self.log_test("Admin Login (Wrong Password)", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login (Wrong Password)", False, str(e))
            return False
    
    def test_get_analytics(self):
        """Test getting analytics data"""
        try:
            response = requests.get(f"{self.base_url}/admin/analytics", timeout=10)
            success = (response.status_code == 200 and 
                      "total_visits" in response.json() and
                      "total_subscribers" in response.json() and
                      "conversion_rate" in response.json())
            analytics = response.json() if success else {}
            details = f"Status: {response.status_code}, Analytics: {analytics}"
            self.log_test("Get Analytics", success, details)
            return success, analytics if success else None
        except Exception as e:
            self.log_test("Get Analytics", False, str(e))
            return False, None
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting CuratedCloset API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("-" * 50)
        
        # Test 1: Root endpoint
        if not self.test_root_endpoint():
            print("❌ Root endpoint failed - stopping tests")
            return self.get_results()
        
        # Test 2: Valid email subscription
        success, test_email = self.test_subscribe_valid_email()
        
        # Test 3: Duplicate email (if previous test passed)
        if success and test_email:
            self.test_subscribe_duplicate_email(test_email)
        
        # Test 4: Invalid email
        self.test_subscribe_invalid_email()
        
        # Test 5: Get subscribers
        success, subscribers_data = self.test_get_subscribers()
        
        # Test 6: Export functionality
        self.test_export_subscribers()
        
        # Test 7: Track visit
        self.test_track_visit()
        
        # Test 8: Admin login with correct password
        self.test_admin_login_correct_password()
        
        # Test 9: Admin login with wrong password
        self.test_admin_login_wrong_password()
        
        # Test 10: Get analytics
        analytics_success, analytics_data = self.test_get_analytics()
        if analytics_success and analytics_data:
            print(f"   📈 Analytics: {analytics_data['total_visits']} visits, {analytics_data['total_subscribers']} subscribers, {analytics_data['conversion_rate']}% conversion")
        
        # Test 11: Delete subscriber (if we have subscribers)
        if success and subscribers_data and len(subscribers_data.get("subscribers", [])) > 0:
            # Try to delete a subscriber (use the first one)
            subscriber_id = subscribers_data["subscribers"][0].get("id")
            if subscriber_id:
                self.test_delete_subscriber(subscriber_id)
        
        return self.get_results()
    
    def get_results(self):
        """Get test results summary"""
        print("-" * 50)
        print(f"📊 Tests Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return {
            "tests_run": self.tests_run,
            "tests_passed": self.tests_passed,
            "tests_failed": self.tests_run - self.tests_passed,
            "success_rate": (self.tests_passed/self.tests_run*100) if self.tests_run > 0 else 0,
            "test_results": self.test_results
        }

def main():
    """Main test runner"""
    tester = CuratedClosetAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results["tests_failed"] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())