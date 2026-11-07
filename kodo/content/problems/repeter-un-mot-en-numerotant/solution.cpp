#include <iostream>
#include <string>
using namespace std;

int main() {
    string m;
    int k;
    cin >> m >> k;
    for (int i = 0; i < k; i++) {
        cout << i + 1 << " " << m << "\n";
    }
    return 0;
}
