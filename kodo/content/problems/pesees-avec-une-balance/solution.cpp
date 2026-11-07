#include <iostream>
#include <set>
#include <vector>
using namespace std;

int n;
vector<long long> p;
set<long long> masses;

// les poids 0 à i-1 sont placés ; d = (masse à droite) - (masse à gauche)
void explorer(int i, long long d) {
    if (i == n) {
        if (d > 0) {
            masses.insert(d);
        }
        return;
    }
    explorer(i + 1, d);            // poids i de côté
    explorer(i + 1, d + p[i]);     // poids i à droite
    explorer(i + 1, d - p[i]);     // poids i à gauche, avec l'objet
}

int main() {
    cin >> n;
    p.resize(n);
    for (int i = 0; i < n; i++) {
        cin >> p[i];
    }
    explorer(0, 0);
    long long m = 1;
    while (masses.count(m)) {
        m++;
    }
    cout << masses.size() << " " << m << "\n";
    return 0;
}
