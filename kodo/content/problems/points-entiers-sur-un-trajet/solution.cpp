#include <iostream>
#include <vector>
using namespace std;

// algorithme d'Euclide
long long pgcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];

    long long total = 1;                 // le point de départ
    for (int i = 0; i + 1 < n; i++) {
        long long dx = x[i + 1] - x[i], dy = y[i + 1] - y[i];
        if (dx < 0) dx = -dx;
        if (dy < 0) dy = -dy;
        // le segment est coupé en pgcd(dx, dy) pas égaux, qui tombent sur des points entiers
        total += pgcd(dx, dy);
    }
    cout << total << "\n";
    return 0;
}
