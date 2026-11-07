#include <iostream>
using namespace std;

int main() {
    long long n, m, k;
    cin >> n >> m >> k;
    long long total = 0;
    for (long long h = 1; h <= n; h++) {          // hauteur du rectangle
        for (long long w = 1; w <= m; w++) {      // largeur du rectangle
            if (h * w <= k) {
                // nombre de places pour un rectangle h × w
                total = total + (n - h + 1) * (m - w + 1);
            }
        }
    }
    cout << total << "\n";
    return 0;
}
