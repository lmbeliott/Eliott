#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> prod(n);
    for (int i = 0; i < n; i++) {
        cin >> prod[i];
    }
    // Premier parcours : la somme de toutes les productions.
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + prod[i];
    }
    // Second parcours : x > s / n s'écrit sans division x * n > s.
    int bons = 0;
    for (int i = 0; i < n; i++) {
        if (prod[i] * n > s) {
            bons = bons + 1;
        }
    }
    cout << bons << "\n";
    return 0;
}
