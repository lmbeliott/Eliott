#include <iostream>
using namespace std;

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

int goldbach(int n) {
    // q = n - p est déterminé par p, et p <= q revient à p <= n / 2.
    int total = 0;
    for (int p = 2; p <= n / 2; p++) {
        if (est_premier(p) && est_premier(n - p)) {
            total = total + 1;
        }
    }
    return total;
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int n;
        cin >> n;
        cout << goldbach(n) << "\n";
    }
    return 0;
}
