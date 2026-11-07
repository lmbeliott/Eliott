#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // a, b, c : nombres de façons pour i - 3, i - 2 et i - 1 marches
    long long a = 0;     // W(-2)
    long long b = 0;     // W(-1)
    long long c = 1;     // W(0) : la montée vide
    for (int i = 1; i <= n; i++) {
        long long nouveau = a + b + c;   // dernier pas de 3, de 2 ou de 1 marche
        a = b;
        b = c;
        c = nouveau;
    }
    cout << c << "\n";
    return 0;
}
