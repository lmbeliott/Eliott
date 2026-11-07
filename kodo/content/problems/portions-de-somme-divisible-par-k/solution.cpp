#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long k;
    cin >> n >> k;
    unordered_map<long long, long long> vus;   // reste -> nombre de préfixes déjà vus
    vus[0] = 1;                                 // P[0] = 0
    long long p = 0, total = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        p += x;
        long long r = ((p % k) + k) % k;        // reste entre 0 et k - 1, même si p < 0
        if (vus.count(r) > 0) {
            total += vus[r];
        }
        vus[r]++;
    }
    cout << total << "\n";
    return 0;
}
