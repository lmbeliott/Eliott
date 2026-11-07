#include <iostream>
using namespace std;

bool est_premier(int n) {
    // 0 et 1 ne sont pas premiers.
    if (n < 2) {
        return false;
    }
    // Un diviseur, s'il existe, est trouvé avant que d * d dépasse n.
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    int a, b;
    cin >> a >> b;
    int paires = 0;
    // p va de A à B - 2, pour que p + 2 reste au plus égal à B.
    for (int p = a; p + 2 <= b; p++) {
        if (est_premier(p) && est_premier(p + 2)) {
            paires++;
        }
    }
    cout << paires << "\n";
    return 0;
}
