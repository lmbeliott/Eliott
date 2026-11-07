#include <iostream>
using namespace std;

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long a, b;
        cin >> a >> b;
        long long total = 0;
        long long p = 1;               // p = 10^k
        for (int k = 0; k < 18; k++) {
            // la roue k tourne une fois par multiple de 10^k entre a+1 et b
            total += b / p - a / p;
            if (k < 17) {
                p = p * 10;
            }
        }
        cout << total << "\n";
    }
    return 0;
}
