#include <iostream>
using namespace std;

// g(1) + g(2) + ... + g(n)
long long F(long long n) {
    if (n == 0) {
        return 0;
    }
    long long m = (n + 1) / 2;   // nombre d'impairs entre 1 et n
    return m * m + F(n / 2);
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long l, r;
        cin >> l >> r;
        cout << F(r) - F(l - 1) << "\n";
    }
    return 0;
}
