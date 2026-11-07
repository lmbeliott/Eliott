#include <iostream>
using namespace std;

long long pgcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

// Remplace p/q par p/q + a/b, sous forme irréductible.
void ajouter(long long &p, long long &q, long long a, long long b) {
    long long num = p * b + a * q;
    long long den = q * b;
    long long d = pgcd(num, den);
    p = num / d;
    q = den / d;
}

int main() {
    int n;
    cin >> n;
    long long p = 0, q = 1;
    for (int i = 0; i < n; i++) {
        long long a, b;
        cin >> a >> b;
        ajouter(p, q, a, b);
    }
    cout << p << "/" << q << "\n";
    return 0;
}
