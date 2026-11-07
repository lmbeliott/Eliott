#include <iostream>
#include <utility>
using namespace std;

// renvoie (F(n) mod m, F(n + 1) mod m)
pair<long long, long long> fib(long long n, long long m) {
    if (n == 0) {
        return {0, 1 % m};
    }
    pair<long long, long long> p = fib(n / 2, m);   // F(k), F(k + 1) avec k = n / 2
    long long a = p.first, b = p.second;
    long long c = a * ((2 * b - a + m) % m) % m;    // F(2k), sans reste négatif
    long long d = (a * a + b * b) % m;              // F(2k + 1)
    if (n % 2 == 0) {
        return {c, d};
    }
    return {d, (c + d) % m};
}

int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n, m;
        cin >> n >> m;
        cout << fib(n, m).first << "\n";
    }
    return 0;
}
