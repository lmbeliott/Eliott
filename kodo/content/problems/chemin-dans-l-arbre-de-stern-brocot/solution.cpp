#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        long long p, q;
        cin >> p >> q;
        vector<pair<char, long long>> blocs;
        while (p != q) {
            if (p > q) {
                long long k = (p - 1) / q;  // nombre de pas à droite : on retire q tant que p reste > q
                blocs.push_back({'R', k});
                p -= k * q;
            } else {
                long long k = (q - 1) / p;  // nombre de pas à gauche
                blocs.push_back({'L', k});
                q -= k * p;
            }
        }
        cout << blocs.size();
        for (auto [lettre, k] : blocs) cout << " " << lettre << " " << k;
        cout << "\n";
    }
    return 0;
}
