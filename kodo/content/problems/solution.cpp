#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long x, b, c, m;
    cin >> n >> x >> b >> c >> m;
    vector<long long> a(n);
    a[0] = x;
    for (int i = 1; i < n; i++) {
        a[i] = (a[i - 1] * b + c) % m;
    }

    long long total = 0;
    vector<int> pile;    // indices dont les valeurs sont strictement croissantes
    for (int i = 0; i <= n; i++) {
        // la position n joue le rôle d'une valeur plus petite que tout : elle vide la pile
        while (!pile.empty() && (i == n || a[pile.back()] >= a[i])) {
            int j = pile.back();
            pile.pop_back();
            long long g = pile.empty() ? -1 : pile.back();   // dernière position avant j de valeur < a[j]
            long long d = i;                                 // première position après j de valeur <= a[j]
            total += a[j] * (j - g) * (d - j);
        }
        pile.push_back(i);
    }
    cout << total << "\n";
    return 0;
}
