#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// Nouveau tableau : a + b, coefficient par coefficient.
vector<long long> somme(const vector<long long> &a, const vector<long long> &b) {
    int n = max(a.size(), b.size());
    vector<long long> r(n, 0);
    for (int k = 0; k < (int)a.size(); k++) {
        r[k] = r[k] + a[k];
    }
    for (int k = 0; k < (int)b.size(); k++) {
        r[k] = r[k] + b[k];
    }
    return r;
}

// a[i] * b[j] contribue au terme de degré i + j.
vector<long long> produit(const vector<long long> &a, const vector<long long> &b) {
    vector<long long> r(a.size() + b.size() - 1, 0);
    for (int i = 0; i < (int)a.size(); i++) {
        for (int j = 0; j < (int)b.size(); j++) {
            r[i + j] = r[i + j] + a[i] * b[j];
        }
    }
    return r;
}

// Horner : P(y) = p0 + y (p1 + y (p2 + ... + y pn)).
vector<long long> composer(const vector<long long> &p, const vector<long long> &q) {
    int n = p.size() - 1;
    vector<long long> r = {p[n]};
    for (int i = n - 1; i >= 0; i--) {
        r = somme(produit(r, q), {p[i]});
    }
    return r;
}

vector<long long> lire_polynome() {
    int deg;
    cin >> deg;
    vector<long long> p(deg + 1);
    for (int i = 0; i <= deg; i++) {
        cin >> p[i];
    }
    return p;
}

int main() {
    vector<long long> p = lire_polynome();
    vector<long long> q = lire_polynome();
    vector<long long> r = composer(p, q);
    for (int i = 0; i < (int)r.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << r[i];
    }
    cout << "\n";
    return 0;
}
