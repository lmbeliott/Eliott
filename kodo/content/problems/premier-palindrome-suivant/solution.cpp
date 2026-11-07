#include <iostream>
using namespace std;

int renverser(int n) {
    int r = 0;
    while (n > 0) {
        r = r * 10 + n % 10;
        n = n / 10;
    }
    return r;
}

bool est_palindrome(int n) {
    return renverser(n) == n;
}

bool est_premier(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    int n;
    cin >> n;
    // Le test de palindrome, rapide, est fait en premier.
    while (!(est_palindrome(n) && est_premier(n))) {
        n = n + 1;
    }
    cout << n << "\n";
    return 0;
}
