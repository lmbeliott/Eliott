#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const long long M = 1000000007;
    int n;
    cin >> n;
    long long total = 0;      // a1 + ... + aN, modulo M
    long long produit = 1;    // (1 + a1)(1 + a2)...(1 + aN), modulo M
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        total = (total + x) % M;
        produit = produit * ((1 + x) % M) % M;
    }
    long long puissance = 1;  // 2^(N-1) modulo M
    for (int i = 0; i < n - 1; i++) {
        puissance = puissance * 2 % M;
    }
    cout << total * puissance % M << "\n";
    cout << ((produit - 1) % M + M) % M << "\n";
    return 0;
}
